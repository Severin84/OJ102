import {atom} from 'recoil';
import {recoilPersist} from 'recoil-persist'


const {persistAtom}=recoilPersist();
export const homepageQuestionState=atom({
    key:'homepageQuestionState',
    default:{
        isLoading:true,
        question:null,
    },
    effects_UNSTABLE:[persistAtom],
})