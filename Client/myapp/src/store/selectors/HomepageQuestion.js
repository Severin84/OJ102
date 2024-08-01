import { selector } from 'recoil';
import {homepageQuestionState} from '../atoms/HomepageQuestion';


export const homepageQuestionDetails=selector({
    key:'homepageQuestionDetailsState',
    get:({get})=>{
        const state=get(homepageQuestionState);

        return state;
    }
})