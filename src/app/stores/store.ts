
import ActivityStore from "./activityStore";
import {createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";


interface Store{
    userStore: UserStore;
    activityStore: ActivityStore;
    commonStore: CommonStore;
    modalStore: ModalStore
}

export const store: Store = {
    userStore: new UserStore(),
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);