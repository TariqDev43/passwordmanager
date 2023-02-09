import { initializeApp } from 'firebase/app';
// import admin from "firebase-admin";

import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateCurrentUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCsbcjhdQw31OQeg5KrC7qXQuuvqk7VzWw',
  authDomain: 'passwordmanager-43.firebaseapp.com',
  databaseURL: 'https://passwordmanager-43-default-rtdb.firebaseio.com',
  projectId: 'passwordmanager-43',
  storageBucket: 'passwordmanager-43.appspot.com',
  messagingSenderId: '419467193948',
  appId: '1:419467193948:web:04cbbaea7c74e5dfe80099',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);

/*
 ********************************************* */
// Admin App

export const login = async () => {
  try {
    const data = await signInWithEmailAndPassword(auth, 'a@b.com', 'abc123');
    return data.user;
  } catch (err) {
    console.log(err.message);
  }
};

// admin.initializeApp({
//   credential: admin.credential.cert(
//     "./passwordmanager-43-firebase-adminsdk-jivnk-bf2268982e.json"
//   ),
//   databaseURL: "https://passwordmanager-43-default-rtdb.firebaseio.com",
// });
// const adminAuth = admin.auth();
export const createUser = async (uid, email, password, name) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
  // admin
  //   .auth()
  //   .createUser({
  //     uid: uid,
  //     email: email,
  //     password: password,
  //   })
  //   .then(function (userRecord) {
  //     // See the UserRecord reference doc for the contents of userRecord.
  //     console.log("Successfully created new user:", userRecord.uid);
  //     addUserData(userRecord.uid, email, password, name);
  //     addCategory("facebook", "facebook", {
  //       icon: "facebook",
  //       fav_icon: "heart-outline",
  //       account_name: "Example Account",
  //       email: "example@example.com",
  //       password: "examplePassword",
  //     });
  //     addCategory("google", "google", {
  //       icon: "facebook",
  //       fav_icon: "heart-outline",
  //       account_name: "Example Account",
  //       email: "example@example.com",
  //       password: "examplePassword",
  //     });
  //     addCategory("instagram", "instagram", {
  //       icon: "facebook",
  //       fav_icon: "heart-outline",
  //       account_name: "Example Account",
  //       email: "example@example.com",
  //       password: "examplePassword",
  //     });
  //   })
  //   .catch(function (error) {
  //     console.log("Error creating new user:", error.message);
  //   });
};

// const getAllUsers = async () => {
//   try {
//     const listUsersResult = await adminAuth.listUsers();

//     listUsersResult.users.forEach((userRecord) => {
//       console.log("user", userRecord.toJSON());
//     });
//   } catch (error) {
//     console.log("Error fetching users:", error);
//   }
// };

const uid = 'abcTestAccount';
const email = 'a@b.com';
const password = 'abc123';
const name = 'tariq';
// createUser(uid, email, password, name);
// getAllUsers();

const addUserData = async (uid, email, password, name) => {
  const userRef = collection(db, 'Users');

  try {
    await setDoc(doc(userRef, uid), {
      uid,
      email,
      password,
      name,
    });
    console.log('Successfully Added');
  } catch (error) {
    console.log(error.message);
  }
};
// addUserData(uid, email, password, name);
// createUser(uid, email, password, name);

const getUserData = async (uid) => {
  let userRef = doc(db, `Users/${uid}`);
  let data;
  await getDoc(userRef)
    .then((res) => {
      data = res.data();
    })
    .catch((err) => console.log(err.message));
  return data;
};
/*
 ********************************************* */

/*  add category
 ********************************************* */
const addCategory = (categoryName, icon_rec, categoryData) => {
  let category = categoryName.toLowerCase();
  let icon = icon_rec.toLowerCase();

  // Category Items
  const category_ref = collection(db, `Users/${uid}/Categories/${category}/Items`);
  addDoc(category_ref, categoryData)
    .then((data) => {
      console.log('Doc Added');
    })
    .catch((err) => console.log(err.message));

  // Icon
  const totalCategories = collection(db, `Users/${uid}/ToalCategories`);
  addDoc(totalCategories, { category, icon });
};

/*   Get Category By Name
 ********************************************* */
const getAllCategories = async () => {
  const categories = collection(db, `Users/${uid}/ToalCategories`);
  let data = [];
  await getDocs(categories)
    .then((res) => {
      res.docs.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
    })
    .catch((err) => console.log(err.message));
  return data;
};
const getCategoryByName = async (name) => {
  const categories = collection(db, `Users/${uid}/Categories/${name.toLowerCase()}/Items`);
  let data = [];
  await getDocs(categories)
    .then((res) => {
      res.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
    })
    .catch((err) => console.log(err.message));

  return data;
};

// console.log(await getCategoryByName("facebook"));

// console.log(await getAllCategories());

// addCategory("facebook", "facebook", { test: "this is just a test" });
