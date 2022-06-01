import { ChangeEvent, useCallback, useState } from "react";
import { simpleJSON } from "../ts/interfaces";
import { akt2json, akt2xls, makeBaseTable, readToText, tableRow } from "../ts/utils";
import useBtn, { Ibtn } from "../hooks";

interface MakeBtnProps {
    btn: Ibtn;
    func: () => void;
}

const MakeBtn: React.FC<MakeBtnProps> = ({ btn, func }) => {
    return (
        <div className={`${btn.id} between`}>
            <button id={btn.id} disabled={btn.disabled} onClick={func}>{btn.name}</button>
            {btn.ready && <a href={btn.url} download={btn.fileName}>{btn.fileName}</a>}
        </div>
    );
};


const MainPage: React.FC = () => {
    const [disDiff, setDisDiff] = useState(true);
    const [diff, setDiff] = useState(false);
    const [filesList, setFilesList] = useState([] as simpleJSON[]);
    const [finalData, setMergedData] = useState({} as simpleJSON);

    const convertBtn = useBtn("convert", "JSON2XLS");
    const mergeBtn = useBtn("merge", "MERGE");

    const loadFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        clearData();
        if (files) {
            try {
                for (const file of files) {
                    Promise.resolve(readToText(file)).then(parseJSON);
                }
                mergeBtn.enable();
            } catch (err) {
                console.log(err);
            }
            setDisDiff(!(files.length === 2));
        }
    };

    const parseJSON = (str: string) => {
        const preresult: simpleJSON = JSON.parse(str);
        setFilesList(prev => [preresult, ...prev]);
    };

    const mergeJSONs = useCallback((/*filesList: IJson[]*/) => {
        let dubl = "";
        let dublJson: simpleJSON = {};
        let mergedData: simpleJSON = {};

        for (const newData of filesList) {

            const dublArr = Object.keys(mergedData).filter(key => !diff === Object.keys(newData).includes(key));
            for (const i of dublArr) {
                if (diff) {
                    dublJson[i] = mergedData[i];
                    dubl = `Не найден: ${i}`;
                } else {
                    dubl = `Дубликат: ${i}\n` +
                        `Предыдущее вхождение: ${mergedData[i]}\n` +
                        `Текущее вхождение: ${newData[i]}`;
                }
                console.warn(dubl);
            }
            if (dublArr.length && !diff) {
                alert("См консоль!");
            }
            mergedData = { ...mergedData, ...newData };
        };

        console.log("mergedData", mergedData);
        const url = akt2json(diff ? dublJson : mergedData);
        mergeBtn.update(`${diff ? "Diff" : "Merged"}.json`, url);
        if (!diff) {
            convertBtn.enable();
        }
        mergeBtn.disable();
        setMergedData(mergedData);
    }, [convertBtn, diff, filesList, mergeBtn]);

    const json2xls = useCallback(() => {
        const name = "Coverted.xls";
        const akt_table = makeBaseTable();
        const tbody = akt_table.querySelector("tbody")!;
        for (const [key, val] of Object.entries(finalData)) {
            tbody.appendChild(tableRow([key, ...Object.values(val)]));
        }

        const url = akt2xls(akt_table, name);
        convertBtn.update(name, url);
        convertBtn.disable();
    }, [convertBtn, finalData]);

    const clearData = () => {
        setFilesList([]);
        setDiff(false);
        mergeBtn.disable();
        convertBtn.disable();
        mergeBtn.setName("MERGE");
        partClearData();
        setMergedData({});
    };

    const partClearData = () => {
        mergeBtn.remove();
        convertBtn.remove();
    };

    const changeDiff = () => {
        mergeBtn.setName(diff ? "MERGE" : "DIFF");
        setDiff(!diff);
        partClearData();
        mergeBtn.enable();
        convertBtn.disable();
    };

    return (<>
        <div className="license-text between">
            <p>Merge JSONs &amp; Convert to XLS</p>
        </div>
        <div id="main">
            <div className="diff">
                <input id="diff" type="checkbox" checked={diff} disabled={disDiff} onChange={changeDiff} />
                Diff
            </div>
            <input id="source" type="file" multiple accept="application/json" onChange={loadFiles} />
            <MakeBtn btn={mergeBtn} func={mergeJSONs} />
            <MakeBtn btn={convertBtn} func={json2xls} />
        </div>
    </>);
};

export default MainPage;