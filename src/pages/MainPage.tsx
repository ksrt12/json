import { ChangeEvent, useCallback, useState } from "react";
import { ProgramJSON } from "../ts/interfaces";
import { akt2json, readToText } from "../ts/utils";
import useBtn from "../hooks/new";
import MakeBtn from "../components/MakeBtn";

type Root = ProgramJSON.Root;

const MainPage: React.FC = () => {
    const [change, setChange] = useState(false);
    const [filesList, setFilesList] = useState([] as Root[]);

    const mergeBtn = useBtn("merge", "MERGE", false);

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
        }
    };

    const parseJSON = (str: string) => {
        const preresult: Root = JSON.parse(str);
        setFilesList(prev => [preresult, ...prev]);
    };

    const mergeJSONs = useCallback((/*filesList: IJson[]*/) => {

        const mergedData: Root[] = [];

        filesList.forEach(newData => {

            if (change) {

                if (typeof newData.programs[0].peopleIsu === "string") {
                    newData.programs[0].peopleIsu = (newData.programs[0].peopleIsu as string).split(",").map(i => Number(i).toString());
                }

                if (typeof newData.programs[0].similarPrograms === "string") {
                    //@ts-ignore
                    newData.programs[0].similarPrograms = newData.programs[0].similarPrograms.length
                        ? (newData.programs[0].similarPrograms as string).split(",").map(i => Number(i).toString())
                        : [];
                }
                for (const [key, val] of Object.entries(newData.programs[0])) {
                    if (key.includes("video") && typeof val === "string") {

                        if (!newData.programs[0].videos) {
                            newData.programs[0].videos = [];
                        }
                        if (val.length)
                            newData.programs[0].videos.push(val);
                        delete (newData.programs[0])[key as keyof ProgramJSON.Program];

                    }
                }
            }
            mergedData.push(newData);

        });

        // console.log("mergedData", mergedData);
        const len = mergedData.length;
        if (len) mergeBtn.update([`Merged_${len}.json`, akt2json(mergedData)]);
        mergeBtn.disable(false);

    }, [filesList, mergeBtn, change]);

    const clearData = () => {
        setFilesList([]);
        mergeBtn.disable();
        mergeBtn.remove();
    };

    return (<>
        <div className="license-text between">
            <p>Merge JSONs &amp; Convert to XLS</p>
        </div>
        <div id="main">
            <div className="diff">
                <input id="diff" type="checkbox" checked={change} onChange={() => setChange(!change)} />
                Привести к новому виду
            </div>
            <input id="source" type="file" multiple accept="application/json" onChange={loadFiles} />
            <MakeBtn p={mergeBtn.p} func={mergeJSONs} />
        </div>
    </>);
};

export default MainPage;