import React, { Suspense } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import ThemeContext from '../context/ThemeContext';
import api from '../services/api';
import { BookProps } from '../types/BookProps';
import Form from './Form';
import Item from './Item';

export default function Main() {
  const [books, setBooks] = React.useState<BookProps[]>([]);
  const theme = React.useContext(ThemeContext);

  React.useEffect(() => {
    api.get("/search?").then((response) => {
        setBooks(response.data.hits);
    });
  }, []);

  const getBooks = async (searchBook: string) => {
    try {
      const { data } = await api.get(`/search?query=${searchBook}`);
      setBooks(data.hits);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<BookProps>) => (
    <Item author={item.author} title={item.title} url={item.url} objectID={item.objectID} />
  );

  return (
    <View style={{ ...styles.container, backgroundColor: theme.background }}>
      <Form getBooks={getBooks} />

      <View style={styles.body}>
          <FlatList
            data={books}
            renderItem={renderItem}
            keyExtractor={item => item.objectID}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 3,
  },
});