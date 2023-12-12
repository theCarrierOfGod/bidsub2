import React, { createContext, useContext, useEffect, useState } from "react";

const HookContext = createContext(null);

export const Hook = ({ children }) => {
    const api = "https://text.thelikey.com/";

    return (
        <HookContext.Provider value={{ api }}>
            {children}
        </HookContext.Provider>
    )
}

export const useHook = () => {
    return useContext(HookContext);
}