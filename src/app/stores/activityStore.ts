import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid'
import { store } from "./store";
import { Profile } from "../models/profile";


export default class ActivityStore{
    //activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity?:Activity = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor(){
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        const sortedActivities = this.activitiesByDate;
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date!.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as {[key:string]: Activity[]}))
    }

    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            //this.activities = activities;
            this.setLoadingInitial(false)
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false)
            
        }
    }

    loadActivity = async(id: string) => {
        let activity = this.getActivity(id);
        if (activity){
            this.selectedActivity = activity;
            return activity;
        } else {
            this.setLoadingInitial(true);
            try {
                const activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
                
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id)
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if(user){
            activity.isGoing = activity.attendees!.some(a => a.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(a => a.username === activity.hostUsername)
        }
        activity.date = new Date( activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean) =>{
        this.loadingInitial= state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id): this.cancelSelectActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;

    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore!.user;
        const profile = new Profile(user!);
        // activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user?.username;
            newActivity.attendees = [profile];
            this.setActivity(newActivity);
            runInAction(() => this.selectedActivity  = newActivity);
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false)
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id){
                    let updatedActivity = {...this.getActivity(activity.id), ...activity};
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity  = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    updateAttendance = async () => {
        this.loading = true;
        const user = store.userStore.user;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a  => a.username === user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
            
        }finally{
            runInAction(() => this.loading = false)
        }
    }

    cancelActivity = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = true;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            
        }finally{
            runInAction(() => this.loading = false)
        }
    }

    cleatActivity = () => {
        this.selectedActivity = undefined;
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            
            runInAction(() => {
                this.activityRegistry.delete(id);
                //this.activities = [...this.activities.filter(a => a.id !== id)]
                if (id === this.selectedActivity?.id) {
                    this.selectedActivity = undefined;
                }
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if(attendee.username === username){
                    attendee.following? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}