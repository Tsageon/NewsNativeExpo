import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Linking, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';
import Header from '../components/Appbar';

export default class NewsScreen extends Component {
    state = {
        articles: [],
        bookmarkedArticles: [],
        isLoading: true,
        errors: null,
        selectedCategory: "bitcoin",
        totalPages: 1,
        page: 1,
    };

    async componentDidMount() {
        this.getNews();
        this.loadBookmarks();
    }

    getNews() {
        const { selectedCategory, page } = this.state;

        fetch(`https://newsapi.org/v2/everything?q=${selectedCategory}&page=${page}&apiKey=a3919a8d92694b498d225157c9bc7f19`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                const uniqueArticles = Array.from(new Set(data.articles.map(a => a.url)))
                    .map(url => data.articles.find(a => a.url === url));

                const news = uniqueArticles.map(article => ({
                    title: article.title,
                    url: article.url,
                    publishedAt: this.formatDate(article.publishedAt),
                    description: article.description,
                    urlToImage: article.urlToImage
                }));

                this.setState(prevState => ({
                    articles: page === 1 ? news : [...prevState.articles, ...news],
                    isLoading: false,
                    totalPages: Math.ceil(data.totalResults / 10),
                }));
            })
            .catch(error => {
                console.error("Error fetching the news:", error);
            });
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', hour12: true };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    toggleBookmark = async (article) => {
        let { bookmarkedArticles } = this.state;

        const isBookmarked = bookmarkedArticles.some(a => a.url === article.url);

        if (isBookmarked) {
            bookmarkedArticles = bookmarkedArticles.filter(a => a.url !== article.url);
        } else {
            bookmarkedArticles.push(article);
        }

        this.setState({ bookmarkedArticles });
        await AsyncStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
    };

    loadBookmarks = async () => {
        const storedBookmarks = await AsyncStorage.getItem('bookmarkedArticles');
        if (storedBookmarks) {
            this.setState({ bookmarkedArticles: JSON.parse(storedBookmarks) });
        }
    };

    handleCategoryChange = (category) => {
        this.setState({ selectedCategory: category, isLoading: true, page: 1 }, () => {
            this.getNews();
        });
    };

    loadMoreArticles = () => {
        const { page, totalPages } = this.state;
        if (page < totalPages) {
            this.setState({ page: page + 1, isLoading: true }, () => {
                this.getNews();
            });
        }
    };

    handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;

        if (contentHeight - contentOffsetY <= layoutHeight + 50) {
            this.loadMoreArticles();
        }
    };

    render() {
        const { isLoading, articles, bookmarkedArticles, selectedCategory, totalPages, page } = this.state;

        return (
            <ScrollView>
            <View>
                <TouchableOpacity>
                    <Header />
                    <View
                        style={{
                            backgroundColor: 'lightgrey',
                            borderRadius: 10,
                            height: 50,
                            width: 200,
                            alignSelf: 'center',
                            marginVertical: 10,
                            overflow: 'hidden',
                        }}
                    >
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={this.handleCategoryChange}
                            style={{ flex: 1 }}
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
                                const isBookmarked = bookmarkedArticles.some(a => a.url === url);

                                return (
                                    <Card key={url || `article-${index}`}
                                        style={{
                                            marginTop: 10,
                                            borderColor: 'blue',
                                            borderRadius: 5,
                                            borderBottomWidth: 1
                                        }}
                                        onPress={() => { Linking.openURL(`${url}`); }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ justifyContent: 'space-around', flex: 2 / 3, margin: 10 }}>
                                                <Title>{title}</Title>
                                            </View>
                                            <View style={{ flex: 1 / 3, margin: 10 }}>
                                                <Image style={{ width: 150, height: 150, borderRadius: 20 }} source={{ uri: urlToImage }} />
                                            </View>
                                        </View>
                                        <View style={{ margin: 10 }}>
                                            <Paragraph>{description}</Paragraph>
                                            <Text>Published At: {publishedAt}</Text>
                                            <Button
                                                title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                                                onPress={() => this.toggleBookmark(article)}
                                            />
                                        </View>
                                    </Card>
                                );
                            })
                        ) : (
                            <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20, flex: 1, alignItems: 'center', justifyContent: 'center' }} />
                        )}
                        {!isLoading && page < totalPages && (
                            <Button title='Load More'
                                onPress={this.loadMoreArticles}
                                disabled={isLoading} />)}
                 
                </TouchableOpacity>
            </View>
            </ScrollView>
        );
    }
}