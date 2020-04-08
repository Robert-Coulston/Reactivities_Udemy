export interface IProfileFormValues {
    displayName: string,
    bio: string,
}

export interface IProfile extends IProfileFormValues {
    userName : string,
    image:string,
    following:boolean,
    followersCount:number,
    followingCount:number,
    photos: IPhoto[]

}

export interface IPhoto {
    id: string,
    url : string,
    isMain: boolean
}

export class ProfileFormValues implements IProfileFormValues {
    displayName: string = "";
    bio:string = "";
  
    constructor(init?: IProfileFormValues) {
      Object.assign(this, init);
    }
  }