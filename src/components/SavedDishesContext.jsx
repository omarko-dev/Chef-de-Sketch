import React, { createContext, useState } from 'react';

export const SavedDishesContext = createContext();

export const SavedDishesProvider = ({ children }) => {
    const [savedDishes, setSavedDishes] = useState([]);

    const addDish = (dish) => {
        setSavedDishes((prevDishes) => [...prevDishes, dish]);
    };

    const getDishes = () => {
        return savedDishes;
    };

    return (
        <SavedDishesContext.Provider value={{ savedDishes, addDish, getDishes }}>
            {children}
        </SavedDishesContext.Provider>
    );
};