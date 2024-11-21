import React, { Component } from 'react';
import {
    StyleSheet, View, Text,  Image, ScrollView, Linking, TouchableOpacity,
    ActivityIndicator} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
import Header from '../components/Appbar';

export default class NewsScreen extends Component {
    state = {
        articles: [],
        bookmarkedArticles: [],
        isLoading: true,
        isPressed: false,
        selectedCategory: 'bitcoin',
        totalPages: 1,
        page: 1,
    };

    async componentDidMount() {
        this.getNews();
        this.loadBookmarks();
    }

    getNews() {
        const { selectedCategory, page } = this.state;

        fetch(
            `https://newsapi.org/v2/everything?q=${selectedCategory}&page=${page}&apiKey=a3919a8d92694b498d225157c9bc7f19`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const uniqueArticles = Array.from(
                    new Set(data.articles.map((a) => a.url))
                ).map((url) => data.articles.find((a) => a.url === url));

                const news = uniqueArticles.map((article) => ({
                    title: article.title,
                    url: article.url,
                    publishedAt: this.formatDate(article.publishedAt),
                    description: article.description,
                    urlToImage: article.urlToImage,
                }));

                this.setState((prevState) => ({
                    articles: page === 1 ? news : [...prevState.articles, ...news],
                    isLoading: false,
                    totalPages: Math.ceil(data.totalResults / 10),
                }));
            })
            .catch((error) => {
                console.error('Error fetching the news:', error);
            });
    }

    formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            hour12: true,
        };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    toggleBookmark = async (article) => {
        let { bookmarkedArticles } = this.state;

        const isBookmarked = bookmarkedArticles.some((a) => a.url === article.url);

        if (isBookmarked) {
            bookmarkedArticles = bookmarkedArticles.filter((a) => a.url !== article.url);
        } else {
            bookmarkedArticles.push(article);
        }

        this.setState({ bookmarkedArticles });
        await AsyncStorage.setItem(
            'bookmarkedArticles',
            JSON.stringify(bookmarkedArticles)
        );
    };

    loadBookmarks = async () => {
        const storedBookmarks = await AsyncStorage.getItem('bookmarkedArticles');
        if (storedBookmarks) {
            this.setState({ bookmarkedArticles: JSON.parse(storedBookmarks) });
        }
    };

    handleCategoryChange = (category) => {
        this.setState(
            { selectedCategory: category, isLoading: true, page: 1 },
            () => {
                this.getNews();
            }
        );
    };

    loadMoreArticles = () => {
        const { page, totalPages } = this.state;
        if (page < totalPages) {
            this.setState({ page: page + 1, isLoading: true }, () => {
                this.getNews();
            });
        }
    };

    render() {
        const { isLoading, articles, bookmarkedArticles, selectedCategory, totalPages, page } = this.state;
  

        return (
            <View style={{ flex: 1 }}>
            <ScrollView>
                    <Header />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={selectedCategory}
                            onValueChange={this.handleCategoryChange}
                            style={styles.picker}
                        >
                            <Picker.Item label="Bitcoin" value="bitcoin" />
                            <Picker.Item label="Technology" value="technology" />
                            <Picker.Item label="Sports" value="sports" />
                            <Picker.Item label="Business" value="business" />
                            <Picker.Item label="Health" value="health" />
                        </Picker>
                    </View>

                    {!isLoading ? (
                        articles.map((article, index) => {
                            const { publishedAt, title, url, description, urlToImage } = article;
                            const isBookmarked = bookmarkedArticles.some((a) => a.url === url);

                            return (
                                <Card key={url || `article-${index}`} style={styles.card}    onPress={() => Linking.openURL(url)}>
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
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => this.toggleBookmark(article)}
                                        >
                                            <Text style={styles.buttonText}>
                                                {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            );
                        })
                    ) : (
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            style={styles.loader}
                        />
                    )}

              {!isLoading && page < totalPages && (
                <TouchableOpacity
                    style={[
                        styles.loadMoreButton,
                        this.state.isPressed && styles.loadMoreButtonPressed,
                    ]}
                    onPressIn={() => this.setState({ isPressed: true })}
                    onPressOut={() => this.setState({ isPressed: false })}
                    onPress={this.loadMoreArticles}
                >
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity> 
                    )}
                        </ScrollView>
                </View>
        
        );
    }
}

const styles = StyleSheet.create({
    ContainerStyle:{
        flex:1
    },
    pickerContainer: {
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        height: 50,
        width: 200,
        alignSelf: 'center',
        marginVertical: 10,
        overflow: 'hidden',
    },
    picker: {
        flex: 1,
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
    button: {
        backgroundColor: '#1E90FF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    loadMoreButton: {
        backgroundColor: '#FF9800', 
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    loadMoreButtonPressed: {
        backgroundColor: 'royalblue', 
    },
});