import { useEffect } from "react";
import { useRedirect } from "../context/RedirectProvider";

export const useScrollUp = () => {
    const {path} = useRedirect()
    
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [path]);
}