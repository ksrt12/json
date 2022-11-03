import React from "react";
type typeVoid = () => void;
type typePromiseVoid = (e: React.MouseEvent) => Promise<void>;
interface MakeBtnProps {
    func: typeVoid | typePromiseVoid;
    column?: boolean;
    p: {
        id: string;
        loading: boolean;
        disabled: boolean;
        name: string;
        ready: boolean;
        url: string;
        fileName: string;
    };
}

const MakeBtn: React.FC<MakeBtnProps> = ({ func, column, p }) => {
    // console.log("render button");
    const { id, loading, disabled, name, ready, url, fileName } = p;

    return (
        <div className={`between${column ? " column" : ""}`}>
            <button id={id} disabled={disabled} onClick={func}>{name}</button>
            {loading && <span className="loader"></span>}
            {ready && <a href={url} download={fileName}>{fileName}</a>}
        </div>
    );
};

export default MakeBtn;