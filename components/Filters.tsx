import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface FiltersProps {
  onChange: (index: number) => void;
  selections: boolean[];
  sections: readonly string[];
}

const Filters: React.FC<FiltersProps> = ({
  onChange,
  selections,
  sections,
}) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onChange(index)}
          style={[
            styles.filterButton,
            {
              backgroundColor: selections[index] ? "#EE9972" : "#495E57",
            },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: selections[index] ? "black" : "white",
              },
            ]}
          >
            {section}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "white",
  },
  filterText: {
    fontSize: 16,
  },
});

export default Filters;
