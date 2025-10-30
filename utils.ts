import * as React from "react";
import { useRef, useEffect } from "react";
import { MenuItem } from "./types/MenuItem";

interface Section {
  title: string;
  data: MenuItem[];
}

export function getSectionListData(menuItems: MenuItem[]): Section[] {
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  return categories.map((category) => ({
    title: category,
    data: menuItems.filter((item) => item.category === category),
  }));
}

export function useUpdateEffect(
  effect: () => void,
  dependencies: React.DependencyList = []
): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
