import { useCallback, useState } from "react";
import { useBeforeunload } from 'react-beforeunload';

const useBtn = (id: string, btnName: string, disabled_default = true) => {
    const [ready, setReady] = useState(false);
    const [name, setName] = useState(btnName);
    const [fileName, setFileName] = useState("");
    const [url, setUrl] = useState("");
    const [disabled, setDisabled] = useState(disabled_default);
    const [loading, setLoading] = useState(false);

    const update = useCallback(([newName, newUrl]: [string, string]) => {
        setFileName(newName);
        setUrl(newUrl);
        setReady(true);
    }, []);

    const remove = useCallback(() => setReady(false), []);

    const disable = useCallback((runLoad = true) => {
        setDisabled(true);
        setLoading(runLoad && true);
    }, []);

    const enable = useCallback(() => {
        setDisabled(false);
        setLoading(false);
    }, []);

    useBeforeunload(event => {
        if (loading) {
            event.preventDefault();
        }
    });

    return { setName, update, remove, disable, enable, p: { id, loading, disabled, name, ready, url, fileName } };
};

export default useBtn;