// import sqlite from "react-native-sqlite-storage";

import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabase("tst.db");

// ********************* Create Table If Not Exists *********************
export const CreateTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, themeMode TEXT,mainColor TEXT,shadows BOOLEAN)"
    );
  });
  console.log("Table Created");
};

// ********************* Drop Table From DB *********************
export const DropTable = () => {
  db.transaction((tx) => {
    tx.executeSql("DROP TABLE settings");
  });
  console.log("Table deleted");
};

// ********************* Getting Data From DB *********************

export const GetData = () => {
  return new Promise((resolve, _reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM settings", [], (_, { rows }) => {
        let data = rows?._array[0];
        resolve(data);
      });
    });
  });
};

// ********************* Delete Data From DB *********************
export const DeleteData = () => {
  let data = null;
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM settings", [], (_, { rows }) => {
      data = rows._array;
      console.log(data);
    });
  });

  return data;
};

// ********************* Insert Data If Not Exists *********************
export const InsertData = async () => {
  const res = await GetData();
  if (res) {
    console.log("data already present");
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO settings (themeMode,mainColor,shadows) VALUES (?,?,?)",
        ["dark", "yellow", "false"]
      );
    });
    console.log("Data Inserted");
  }
};

// ********************* Update Data  *********************
export const UpdateData = (themeMode, mainColor, shadows) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE settings SET themeMode ='${themeMode}', mainColor = '${mainColor}', shadows='${shadows}' where id =1`,
      []
    );
  });
  console.log("Data Updated");
};
