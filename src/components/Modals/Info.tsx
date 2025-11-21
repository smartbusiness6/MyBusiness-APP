// src/components/Modals/InfoModal.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface InfoModalProps {
  visible: boolean;
  message: string;
  type?: "success" | "info" | "warning";
  onClose: () => void;
  duration?: number; // auto-close en ms
}

export const InfoModal = ({
  visible,
  message,
  type = "success",
  onClose,
  duration = 3000,
}: InfoModalProps) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const icons = {
    success: "check-circle",
    info: "info",
    warning: "warning",
  };

  const colors = {
    success: "#05aa65",
    info: "#3498db",
    warning: "#f39c12",
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors[type] }]}>
          <MaterialIcons name={"info"} size={28} color="#fff" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});