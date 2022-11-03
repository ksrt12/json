import { useCallback, useState } from "react";

export interface Ibtn {
    id: string;
    ready: boolean;
    name: string;
    fileName: string;
    url: string;
    disabled: boolean;
    count: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    update: (newName: Ibtn["name"], newUrl: Ibtn["url"]) => void;
    remove: () => void;
    disable: () => void;
    enable: () => void;
    setCount: (v: string | number) => void;
}

const useBtn = (id: string, btnName: string): Ibtn => {
    const [ready, setReady] = useState(false);
    const [name, setName] = useState(btnName);
    const [fileName, setFileName] = useState("");
    const [url, setUrl] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [count, setCountInit] = useState("");

    const update = useCallback((newName: string, newUrl: string) => {
        setFileName(newName);
        setUrl(newUrl);
        setReady(true);
        setDisabled(true);
    }, []);

    const remove = useCallback(() => {
        setReady(false);
        setCountInit("");
    }, []);

    const disable = useCallback(() => setDisabled(true), []);
    const enable = useCallback(() => setDisabled(false), []);

    const setCount = useCallback((v: string | number) => setCountInit(`${v}`), []);

    return {
        id, ready, name, fileName, url, disabled, count,
        setName, update, remove, disable, enable, setCount
    };
};

export default useBtn;