import { RootStore } from "./rootStore";
import { observable, runInAction, action, computed, reaction } from "mobx";
import agent from "../api/agent";
import { IProfile, IPhoto, IProfileFormValues } from "../models/profile";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers': 'following';
          this.loadFollowings(predicate)
        } else {
          this.followings = [];
        }
      }
    )
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile: boolean = true;
  @observable uploadingPhoto: boolean = false;
  @observable loading: boolean = false;
  @observable deleteLoading: boolean = false;
  @observable submitting = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.userName;
    } else {
      return false;
    }
  }

  @action loadProfile = async (userName: string) => {
    this.loadingProfile = true;
    try {
      const userProfile = await agent.Profiles.get(userName);
      runInAction(() => {
        this.profile = userProfile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction(() => (this.uploadingPhoto = false));
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(x => x.isMain)!.isMain = false;
        this.profile!.photos.find(x => x.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem setting photo as Main");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.deleteLoading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          x => x.id !== photo.id
        );
        this.deleteLoading = false;
      });
    } catch (error) {
      toast.error("Problem deleting photo");
      runInAction(() => {
        this.deleteLoading = false;
      });
    }
  };

  @action editProfile = async (profile: IProfileFormValues) => {
    this.submitting = true;
    try {
      await agent.Profiles.update(profile);
      runInAction("editing profile", () => {
        this.submitting = false;
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      runInAction("edit Profile error", () => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.log(error);
    }
  };

  @action follow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(userName);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem following user");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(userName);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem unfollowing user");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles: IProfile[] = await agent.Profiles.listFollowings(
        this.profile!.userName,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem loading followings");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };
}
