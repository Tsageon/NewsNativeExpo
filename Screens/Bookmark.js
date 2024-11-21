import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class BookmarkScreen extends Component {
  state = {
    bookmarkedArticles: [],
  };

  async componentDidMount() {
    this.loadBookmarks();
  }

  loadBookmarks = async () => {
    const storedBookmarks = await AsyncStorage.getItem('bookmarkedArticles');
    if (storedBookmarks) {
      this.setState({ bookmarkedArticles: JSON.parse(storedBookmarks) });
    }
  };

  render() {
    const { bookmarkedArticles } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
            <TouchableOpacity>
          {bookmarkedArticles.length > 0 ? (
            bookmarkedArticles.map((article, index) => {
              const { title, url, description, urlToImage, publishedAt } = article;

              return (
                <Card key={url || `article-${index}`} style={styles.card} onPress={() => Linking.openURL(url)}>
                  <View style={styles.cardContent}>
                    <View style={styles.textContent}>
                      <Text style={styles.title}>{title}</Text>
                    </View>
                    {urlToImage && (
                      <Image style={styles.image} source={{ uri: urlToImage }} />
                    )}
                  </View>
                  <View style={styles.descriptionContent}>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.publishedAt}>Published At: {publishedAt}</Text>
                  </View>
                </Card>
              );
            })
          ) : (
            <Text style={styles.noBookmarksText}>No Bookmarked Articles</Text>
          )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginTop: 10,
    borderColor: 'blue',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
  },
  textContent: {
    flex: 2 / 3,
    justifyContent: 'space-between',
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    flex: 1 / 3,
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  descriptionContent: {
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  publishedAt: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  noBookmarksText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
