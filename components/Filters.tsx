import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <>
      <View style={styles.filtersContainer}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(index)}
            style={[
              styles.filterButton,
              {
                backgroundColor: selections[index] ? "#495E57" : "#F0F0F0",
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: selections[index] ? "white" : "#495E57",
                },
              ]}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filterBorder} />
    </>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  filterBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccccccff",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495E57",
  },
});

export default Filters;
