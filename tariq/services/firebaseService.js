const firebaseConfig = {
  apiKey: 'AIzaSyCsbcjhdQw31OQeg5KrC7qXQuuvqk7VzWw',
  authDomain: 'passwordmanager-43.firebaseapp.com',
  databaseURL: 'https://passwordmanager-43-default-rtdb.firebaseio.com',
  projectId: 'passwordmanager-43',
  storageBucket: 'passwordmanager-43.appspot.com',
  messagingSenderId: '419467193948',
  appId: '1:419467193948:web:04cbbaea7c74e5dfe80099',
};
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, serverTimestamp, remove, update } from 'firebase/database';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase();

/*  Login - Register
 ********************************************* */

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (user.uid) {
      return user;
    }
  } catch (err) {
    throw err;
  }
};

export const createUser = async (email, password, name) => {
  const defaultCategories = {
    facebook: {
      info: {
        icon: 'facebook',
      },
      items: {
        '-N6dwzTiLPKzIT7gaAMi': {
          category: 'facebook',
          email: 'dddddadsfadsfsdf',
          account_name: 'dsfadsa',
          password: 'asdfasdfadsffffffdddd',
          fav_icon: 'heart-outline',
          key: serverTimestamp(),
        },
      },
    },
    google: {
      info: {
        icon: 'google',
      },
      items: {
        '-N8nvwDXZms7DpuLjDuu': {
          category: 'google',
          email: 'abc@example.com',
          account_name: 'example Account',
          password: 'examplepassword',
          fav_icon: 'heart-outline',

          key: serverTimestamp(),
        },
      },
    },
    instagram: {
      info: {
        icon: 'instagram',
      },
      items: {
        '-N6ibRGx4HG9kPyFakvK': {
          category: 'instagram',
          email: 'abc@example.com',
          account_name: 'example Account',
          password: 'examplepassword',
          fav_icon: 'heart-outline',
          key: serverTimestamp(),
        },
      },
    },
  };
  try {
    // checkinng if username in userNameList
    const userNameList = await get(ref(db, 'Users/UsersList/'));

    const checkUserName = userNameList.forEach((item) => {
      if (item.val().username === name) {
        return true;
      } else {
        return false;
      }
    });

    if (checkUserName) {
      return { error: { message: 'Username already exists' } };
    }

    // creatingUser
    let { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (user.uid) {
      // Updating User Data
      await updateProfile(user, { displayName: name });

      // Entering User Data
      await set(ref(db, 'Users/' + name), {
        User_info: {
          username: name,
          email: email,
          password: password,
          uid: user.uid,
        },
        Categories: defaultCategories,
      });

      // Entering UserName to list Of Usernames
      let UserNameList = {};
      UserNameList[user.uid] = { username: name, uid: user.uid };
      await set(ref(db, 'Users/UsersList/'), UserNameList);

      return user;
    }
  } catch (err) {
    throw err;
  }
};

/*   Get User Info
 ********************************************* */
export const getUserInfo = async (username) => {
  const userInfoRef = ref(db, `Users/${username}/User_info`);
  try {
    const userInfo = await get(userInfoRef);
    return userInfo.val();
  } catch (err) {
    throw err;
  }
};

/*   ALL HOME CATEGORY FUNCTION
 ********************************************* */
export const getAllCategories = async (username) => {
  try {
    const categoriesRef = ref(db, `Users/${username}/Categories/`);
    const data = await get(categoriesRef);

    let allCategories = [];

    const ArrayOfPasswords = (item) => {
      let myArray = [];
      try {
        Object.keys(item).map((key) => myArray.push({ ...item[key], id: key }));
        return myArray;
      } catch (err) {
        throw err;
      }
    };

    data.forEach((category) => {
      allCategories.push({
        category: category.key,
        icon: category.val().info,
        items: category.val().items ? ArrayOfPasswords(category.val().items) : [],
      });
    });

    return allCategories;
  } catch (err) {
    throw err;
  }
};

export const addCategory = async (username, categoryName, icon) => {
  let newCategoryData = {
    info: {
      icon: icon.toLowerCase(),
    },
    items: {},
  };

  const newCategoryRef = ref(db, `Users/${username}/Categories/${categoryName.toLowerCase()}`);
  try {
    await set(newCategoryRef, newCategoryData);
    return 'Done';
  } catch (err) {
    throw err;
  }
};

export const updateCategory = async (username, categoryData, categoryName, icon) => {
  const oldCategoryRef = ref(
    db,
    `Users/${username}/Categories/${categoryData.category.toLowerCase()}`
  );
  const newCategoryRef = ref(db, `Users/${username}/Categories/${categoryName.toLowerCase()}`);

  try {
    // getting data of category to update
    const data = await get(oldCategoryRef, categoryData);

    let newCategoryData = {
      info: {
        icon: icon.toLowerCase(),
      },
      items: data.val().items ? data.val().items : [],
    };
    await removeCategory(username, categoryData.category);
    await set(newCategoryRef, newCategoryData);

    return 'Done';
  } catch (err) {
    throw err;
  }
};

export const removeCategory = async (username, categoryName) => {
  const deleteCategoryRef = ref(db, `Users/${username}/Categories/${categoryName.toLowerCase()}`);
  try {
    await remove(deleteCategoryRef);
    return 'deleted';
  } catch (err) {
    throw err;
  }
};

/*    ALL CATEGORY DETAILS FUNCTIONS
 ********************************************* */

export const addCategoryDetails = async (username, category, categoryData, id) => {
  try {
    const categoryRef = ref(
      db,
      `Users/${username}/Categories/${category.toLowerCase()}/items/${id}`
    );
    const newAdded = await set(categoryRef, categoryData);
    return newAdded;
  } catch (err) {
    throw err;
  }
};
export const updateCategoryDetails = async (username, category, categoryData, id) => {
  try {
    const categoryRef = ref(
      db,
      `Users/${username}/Categories/${category.toLowerCase()}/items/${id}/`
    );
    const newAdded = await update(categoryRef, categoryData);
    return newAdded;
  } catch (err) {
    throw err;
  }
};

export const removeCategoryDetails = async (username, category, id) => {
  const deleteCategoryRef = ref(
    db,
    `Users/${username}/Categories/${category.toLowerCase()}/items/${id}`
  );
  try {
    await remove(deleteCategoryRef);
    return 'deleted';
  } catch (err) {
    throw err;
  }
};

/*    All Favorite Categories
 ********************************************* */
export const getFavs = async (name) => {
  try {
    // set data to Favs
    const favRef = ref(db, `Users/${name}/Favs/`);
    const data = await get(favRef);

    let allFavList = [];
    data.forEach((item) => {
      allFavList.push({ id: item.key, ...item.val() });
    });

    return allFavList;
  } catch (err) {
    throw err;
  }
};

export const addToFav = async (username, category, categoryData, id) => {
  try {
    // set data to Favs
    const favRef = ref(db, `Users/${username}/Favs/${id}`);
    await set(favRef, { ...categoryData, fav_icon: 'heart' });

    // set data to Favs
    const favIconRef = ref(
      db,
      `Users/${username}/Categories/${category.toLowerCase()}/items/${id}`
    );
    await set(favIconRef, { ...categoryData, fav_icon: 'heart' });

    return 'newAdded';
  } catch (err) {
    throw err;
  }
};
export const removeFromFav = async (username, category, categoryData, id) => {
  try {
    // set data to Favs
    const favRef = ref(db, `Users/${username}/Favs/${id}`);
    await remove(favRef);

    // set fav ICon
    const favIconRef = ref(
      db,
      `Users/${username}/Categories/${category.toLowerCase()}/items/${id}`
    );
    await set(favIconRef, { ...categoryData, fav_icon: 'heart-outline' });

    return 'newAdded';
  } catch (err) {
    throw err;
  }
};
