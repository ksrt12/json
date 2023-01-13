import { ChangeEvent, useCallback, useState } from "react";
import { akt2csv, readToText } from "../ts/utils";
import useBtn from "../hooks/new";
import MakeBtn from "../components/MakeBtn";
import { simpleJSON } from "../ts/interfaces";

declare module Table {

  export interface RootObject {
    id: number;
    json_id: number;
    json: string;
  }

}

export interface Level {
  uid?: number;
  leveledu?: string;
}

export interface Comment {
  uid?: number;
  fullName?: string;
  photo?: string;
  year?: string;
  message?: string;
  link?: string;
}

export interface Faq {
  question?: string;
  answer?: string;
}

export interface Achievement {
  studentsText?: string;
  studentsLink?: string;
}

export interface Program {
  isu?: string;
  email?: string;
  phone?: string;
  site?: string;
  vk?: string;
  tg?: string;
  leed?: string;
  description?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  video4?: string;
  video5?: string;
  partner: string[];
  specializationName?: string;
  specializationDescription?: string;
  personIsu?: string;
  peopleIsu?: string;
  careerLeed?: string;
  careerDescription?: string;
  careerPartner?: string[];
  achievements?: Achievement[];
  similarPrograms?: string;
}

export interface RootJSON {
  level?: Level[];
  comments?: Comment[];
  faq?: Faq[];
  programs?: Program[];
}


const MainPage: React.FC = () => {
  const [filesList, setFilesList] = useState([] as Table.RootObject[][]);
  const [separator, setSeparator] = useState(";");

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
    const preresult: Table.RootObject[] = JSON.parse(str);
    setFilesList(prev => [preresult, ...prev]);
  };

  const reducer = useCallback((o: RootJSON | Faq | Comment | Program, result: simpleJSON = {}, finalKey = "") => {
    Object.entries(o).forEach(([key, value]: [string, string | typeof o]) => {
      if (Array.isArray(value) && value.length) {
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            reducer(item, result, `${finalKey}.${key}.${index}`);
          } else {
            result[`${finalKey}.${key}.${index}`] = item || "";
          }
        });
      } else {
        if (typeof value === "object" && value !== null) {
          reducer(value, result, `${finalKey}.${key}`);
        } else {
          result[`${finalKey}.${key}`] = ((value || "") + "").replaceAll('\n', '\\n');
        }
      }
    });
    return result;
  }, []);

  const mergeJSONs = useCallback((/*filesList: IJson[]*/) => {

    const mergedData = filesList.flat().map(f => ({
      id: f.json_id,
      json: JSON.parse(f.json
        .replaceAll('\n', '\\n')
        .replaceAll('\r', '')
      ) as RootJSON
    }));

    const convertedData = mergedData.map(item => ({ [item.id]: reducer(item.json) }));

    const csv = convertedData.map(item => Object.entries(item).map(([id, json]) => Object.entries(json).map(([key, val]) => [id + key, val].join(separator)).join("\n"))).join("\n");

    if (csv.length) mergeBtn.update([`Converted.csv`, akt2csv(csv)]);
    // mergeBtn.disable(false);

  }, [filesList, mergeBtn, reducer, separator]);

  const changeSeparator = (event: ChangeEvent<HTMLInputElement>) => {
    const newSeparator = event.target.value;
    if (newSeparator.length) {
      setSeparator(newSeparator);
    }
  };

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
      <div className="sep">
        <p>Разделитель</p>
        <input id="separator" type="text" onChange={changeSeparator} />
      </div>
      <input id="source" type="file" multiple accept="application/json" onChange={loadFiles} />
      <MakeBtn p={mergeBtn.p} func={mergeJSONs} />
    </div>
  </>);
};

export default MainPage;