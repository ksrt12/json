import { ChangeEvent, useCallback, useState } from "react";
import { ParseResult, parse } from "papaparse";
import { akt2csv, akt2json, mayBeNumber, readToText } from "../ts/utils";
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
  const [reverse, setReverse] = useState(false);
  const [filesList, setFilesList] = useState<Table.RootObject[][]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [separator, setSeparator] = useState(";@");

  const mergeBtn = useBtn("merge", "JSON2CSV", false);

  const loadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    clearData();
    if (files) {
      try {
        for (const file of files) {
          Promise.resolve(readToText(file)).then(reverse ? parseCSV : parseJSON);
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

  const parseCSV = (str: string) => {
    const preresult: ParseResult<string[]> = parse(str, { delimiter: separator });
    setData(prev => [...preresult.data, ...prev]);
  };

  const reducer = useCallback((o: RootJSON | Faq | Comment | Program, result: simpleJSON = {}, finalKey = "") => {
    Object.entries(o).forEach(([key, value]: [string, string | typeof o]) => {
      if (Array.isArray(value) && value.length) {
        value.forEach((item, index) => {
          if (item !== null && typeof item === "object") {
            reducer(item, result, `${finalKey}.${key}.${index}`);
          } else {
            result[`${finalKey}.${key}.${index}`] = item || "";
          }
        });
      } else {
        if (typeof value === "object" && value !== null) {
          reducer(value, result, `${finalKey}.${key}`);
        } else {

          result[`${finalKey}.${key}`] = ((value || "") + "").replaceAll('\n', '@n');
          console.log(result[`${finalKey}.${key}`]);
        }
      }
    });
    return result;
  }, []);

  const reverseReducer = (s: string[][]) => s.reduce((acc, [key, value]) => {
    const keys = key.split(".");
    const lastKey = keys.pop();
    const lastObj = lastKey && keys.reduce((obj, key, i) => {
      if (mayBeNumber(keys[i + 1]).isNumber || mayBeNumber(lastKey).isNumber) {
        //@ts-ignore
        return obj[key] = obj[key] || [];
      }
      //@ts-ignore
      return obj[key] = obj[key] || {};
    }, acc);
    //@ts-ignore
    lastObj[lastKey] = mayBeNumber(value, "@n", "\n").val;
    return acc;
  }, {});

  const json2csv = useCallback((/*filesList: IJson[]*/) => {

    const mergedData = filesList.flat().map(f => ({
      id: f.json_id,
      json: JSON.parse(f.json
        .replaceAll('\n', '\\n')
        .replaceAll('\r', '\\n')
      ) as RootJSON
    }));

    const convertedData = mergedData.map(item => ({ [item.id]: reducer(item.json) }));

    const csv = convertedData.map(item => Object.entries(item).map(([id, json]) => Object.entries(json).map(([key, val]) => [id + key, val].join(separator)).join("\n"))).join("\n");

    if (csv.length) mergeBtn.update([`Converted.csv`, akt2csv(csv)]);
    mergeBtn.disable(false);

  }, [filesList, mergeBtn, reducer, separator]);

  const csv2json = useCallback(() => {
    const json = reverseReducer(data);
    if (Object.keys(json).length) mergeBtn.update([`Converted.json`, akt2json(json)]);
    mergeBtn.disable(false);

  }, [data, mergeBtn]);

  const changeSeparator = (event: ChangeEvent<HTMLInputElement>) => {
    const newSeparator = event.target.value;
    if (newSeparator.length) {
      setSeparator(newSeparator);
    }
  };

  const clearData = () => {
    setFilesList([]);
    setData([]);
    mergeBtn.disable();
    mergeBtn.remove();
  };

  const changeReverse = (rev: boolean) => {
    setReverse(rev);
    mergeBtn.setName(rev ? "CSV2JSON" : "JSON2CSV");
    clearData();
  };

  return (<>
    <div className="license-text between">
      <p>Merge JSONs &amp; Convert to XLS</p>
    </div>
    <div id="main">
      <div className="diff">
        <input id="diff" type="checkbox" checked={reverse} onChange={() => changeReverse(!reverse)} />
        Обратное преобразование
      </div>
      <div className="sep">
        <p>Разделитель</p>
        <input id="separator" type="text" placeholder=";@" onChange={changeSeparator} />
      </div>
      <input id="source" type="file" multiple accept={reverse ? ".csv" : "application/json"} onChange={loadFiles} />
      <MakeBtn p={mergeBtn.p} func={reverse ? csv2json : json2csv} />
    </div>
  </>);
};

export default MainPage;