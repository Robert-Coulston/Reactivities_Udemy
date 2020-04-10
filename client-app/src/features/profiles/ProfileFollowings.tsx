import React, { useContext, useEffect } from "react";
import { Tab, Grid, Header, Card } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileCard from "./ProfileCard";

const ProfileFollowings = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    followings,
    loadFollowings,
    loading,
    activeTab,
    isCurrentUser
  } = rootStore.profileStore;


    useEffect(() => {
      console.log("profile loadings");
    if (activeTab === 3 || activeTab === 4) {
      const predicate = activeTab === 3 ? 'followers': 'following';
      loadFollowings(predicate)
    } 
  }, [profile!.followersCount, profile!.followingCount, activeTab, loadFollowings])

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === 3
                ? isCurrentUser ? "People following me" : `People following ${profile!.displayName}`
                : isCurrentUser ? "People I am following" : `People ${profile!.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followings.map((profile) => (
                <ProfileCard key={profile.userName} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileFollowings;
