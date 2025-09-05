import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, LANGUAGES, SIZES, FONTS } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, getCurrentLanguageName, changeLanguage } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity
      style={[
        styles.item,
        item.code === currentLanguage && styles.selectedItem
      ]}
      onPress={async () => {
        await changeLanguage(item.code);
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemText}>{item.nativeName}</Text>
      {item.code === currentLanguage && (
        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>{getCurrentLanguageName()}</Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <SafeAreaView>
              <View style={styles.header}>
                <Text style={styles.headerText}>Select Language</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={LANGUAGES}
                keyExtractor={item => item.code}
                renderItem={renderItem}
              />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  selectorText: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.text
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end'
  },
  modal: {
    height: '60%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    padding: SIZES.padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding
  },
  headerText: {
    ...FONTS.h3,
    color: COLORS.text
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  selectedItem: {
    backgroundColor: `${COLORS.primary}20`
  },
  itemText: {
    ...FONTS.body3,
    color: COLORS.text
  }
});

export default LanguageSelector;
