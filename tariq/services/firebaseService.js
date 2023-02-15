import { initializeApp } from 'firebase/app';
// import admin from "firebase-admin";

import {
  addDoc,
  deleteDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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

export const login = async (username, password) => {
  try {
    const data = await signInWithEmailAndPassword(auth, username, password);
    return data.user;
  } catch (err) {
    throw err;
  }
};

export const createUser = async (email, password, name) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    addUserData(user.uid, email, password, name);
    addCategory(user.uid, 'facebook', 'facebook', {
      category: 'facebook',
      icon: 'facebook',
      fav_icon: 'heart-outline',
      account_name: 'Example Account',
      email: 'example@example.com',
      password: 'examplePassword',
    });
    addCategory(user.uid, 'google', 'google', {
      category: 'google',
      icon: 'facebook',
      fav_icon: 'heart-outline',
      account_name: 'Example Account',
      email: 'example@example.com',
      password: 'examplePassword',
    });
    addCategory(user.uid, 'instagram', 'instagram', {
      category: 'facebook',
      icon: 'facebook',
      fav_icon: 'heart-outline',
      account_name: 'Example Account',
      email: 'example@example.com',
      password: 'examplePassword',
    });
    return user;
  } catch (err) {
    throw err;
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

// const uid = 'abcTestAccount';
// const email = 'a@b.com';
// const password = 'abc123';
// const name = 'tariq';
// // createUser(uid, email, password, name);
// // getAllUsers();

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
    return 'Successfully Added';
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (uid) => {
  let userRef = doc(db, `Users/${uid}`);
  try {
    const data = await getDoc(userRef);

    return data;
  } catch (err) {
    throw err;
  }
};
/*
 ********************************************* */

/*  add category
 ********************************************* */
export const addCategory = async (uid, categoryName, selectedIcon, categoryData) => {
  let category = categoryName;
  let icon = selectedIcon.toLowerCase();

  // Category Items

  try {
    const category_ref = collection(db, `Users/${uid}/Categories/${category}/Items`);
    const data = await addDoc(category_ref, categoryData);
    const totalCategories = doc(db, `Users/${uid}/TotalCategories`, category.toLowerCase());
    // Adding Category in icon List
    await setDoc(totalCategories, { category, icon });

    return data;
  } catch (err) {
    console.log(err.messsage);
    throw err;
  }
};

export const addFav = async (uid, categoryData) => {
  try {
    // Category Items
    const favRef = collection(db, `Users/${uid}/Fav`);
    // Icon
    const data = await addDoc(favRef, categoryData);
    return data;
  } catch (err) {
    throw err;
  }
};

/*   Get Category By Name
 ********************************************* */
export const getAllCategories = async (uid) => {
  const categories = collection(db, `Users/${uid}/TotalCategories`);
  let allCategories = [];
  try {
    const res = await getDocs(categories);
    res.docs.forEach((doc) => allCategories.push({ ...doc.data(), id: doc.id }));
    return allCategories;
  } catch (err) {
    throw err;
  }
};
export const getAllFav = async (uid) => {
  const favsRef = collection(db, `Users/${uid}/Fav`);
  let allFav = [];
  try {
    const res = await getDocs(favsRef);
    res.docs.forEach((doc) => allFav.push({ ...doc.data(), id: doc.id }));
    return allFav;
  } catch (err) {
    throw err;
  }
};

export const getCategoryByName = async (uid, name) => {
  try {
    const categories = collection(db, `Users/${uid}/Categories/${name.toLowerCase()}/Items`);
    let data = [];
    const res = await getDocs(categories);
    res.docs.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteSelectedDoc = async (uid, name) => {
  try {
    const allItems = collection(db, `Users/${uid}/Categories/${name}/Items`);
    const test = await getDocs(allItems);
    test.forEach((doc) => deleteDoc(doc.ref, doc.id));
    const docRef = doc(db, `Users/${uid}/Categories`, name);
    await deleteDoc(docRef);
    const allCategoriesNames = doc(db, `Users/${uid}/TotalCategories`, name.toLowerCase());
    deleteDoc(allCategoriesNames);
  } catch (err) {
    throw err;
  }
};

// console.log(await getCategoryByName("facebook"));

// console.log(await getAllCategories());

// addCategory("facebook", "facebook", { test: "this is just a test" });
