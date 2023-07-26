export enum LocalstorageItems {
    lastOpenQuestion = 'last-open-question',
    wrongAnswers = 'wrong-answers'
}


export const useLocalstorage = () => {
     const getFromLocalstorage = (item:LocalstorageItems ) => {
        const itemFromLocalstorage = localStorage.getItem(item)
    
        if(itemFromLocalstorage) {
            return itemFromLocalstorage
        }
    
        return ''
    }
    
     const setValueToLocalstorage = (item:LocalstorageItems, value: any ) => {
        localStorage.setItem(item, value)
    }

    return {getFromLocalstorage, setValueToLocalstorage}
}

