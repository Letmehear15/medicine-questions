import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { collectionName, db } from "../firebase";
import { AppSettings } from "../model";
import { EPaths, useRedirect } from "../../context/RedirectProvider";

export const useGetData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<AppSettings>({} as AppSettings);
  const { path } = useRedirect();

  useEffect(() => {
    (async () => {
      if (path === EPaths.MAIN) {
        setIsLoading(true);
        try {
          const data = await getDocs(collection(db, collectionName));

          data.forEach((doc) => {
            setData(doc.data() as AppSettings);
          });
          setIsLoading(false);
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    })();
  }, [path]);

  return { isLoading, data, isError, setIsLoading };
};
