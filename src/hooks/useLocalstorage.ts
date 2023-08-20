export enum LocalstorageItems {
    lastOpenQuestion = 'last-open-question',
    wrongAnswers = 'wrong-answers',
    statistic = 'statistic'
}


export const useLocalstorage = () => {
     const getFromLocalstorage = (item:LocalstorageItems ) => {
        const itemFromLocalstorage = localStorage.getItem(item)
    
        if(itemFromLocalstorage) {
            return JSON.parse(itemFromLocalstorage)
        }
    
        return ''
    }
    
     const setValueToLocalstorage = (item:LocalstorageItems, value: any ) => {
        localStorage.setItem(item, JSON.stringify(value))
    }

    return {getFromLocalstorage, setValueToLocalstorage}
}

