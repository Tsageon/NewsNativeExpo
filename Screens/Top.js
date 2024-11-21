import React, { Component } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Button, Linking, StyleSheet, Image } from 'react-native';
import Swal from 'sweetalert2';

export default class HomePage extends Component {
    state = {
        popularArticles: [],
        recommendedArticles: [],
        isLoadingPopular: true,
        isLoadingRecommended: true,
    };

    async componentDidMount() {
        this.fetchNews(); 
    }


    getPopularNews = async () => {
        try {
            this.setState({ isLoadingPopular: true });
            const url = `https://newsapi.org/v2/top-headlines?q=general&page=1&apiKey=a3919a8d92694b498d225157c9bc7f19`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== 'ok') {
                this.handleNewsError('Popular news fetch failed');
                return;
            }

            const news = data.articles.map((article) => ({
                title: article.title,
                url: article.url,
                description: article.description,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
            }));

            this.setState({ popularArticles: news, isLoadingPopular: false });
        } catch (error) {
            this.handleNewsError('Error fetching popular news');
            console.error('Popular news error:', error);
        }
    };

    getRecommendedNews = async () => {
        try {
            this.setState({ isLoadingRecommended: true });
            const response = await fetch(`https://newsapi.org/v2/everything?q=health&page=1&apiKey=a3919a8d92694b498d225157c9bc7f19`);
            const data = await response.json();

            console.log('Recommended Articles:', data);
            const news = data.articles.map((article) => ({
                title: article.title,
                url: article.url,
                description: article.description,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
            }));

            this.setState({ recommendedArticles: news, isLoadingRecommended: false });
        } catch (error) {
            this.handleNewsError('Error fetching recommended news');
            console.error('Recommended news error:', error);
        }
    };

    handleNewsError = (message) => {
        Swal.fire({
            title: 'News Fetch Error',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });        
        this.setState({ isLoadingPopular: false, isLoadingRecommended: false });
    };

    fetchNews = async () => {
        await this.getPopularNews(); 
        await this.getRecommendedNews();
    };

    render() {
        const { isLoadingPopular, isLoadingRecommended, popularArticles, recommendedArticles } = this.state;

        return (
            <View style={styles.container}>
            <Text style={styles.header}>News</Text>
        
            <View style={styles.newsSection}>
                <Text style={styles.sectionTitle}>Popular News</Text>
        
          
                <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>
                        Want news for a specific country?{' '}
                        <Text 
                            style={styles.link}
                            onPress={() => Linking.openURL('https://www.bing.com/news')}
                        >
                            Click Here
                        </Text>
                    </Text>
                </View>
        
                {isLoadingPopular ? (
                    <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
                ) : (
                    popularArticles.length > 0 ? (
                        <ScrollView>
                            {popularArticles.map((article, index) => (
                                <View key={index} style={styles.article}>
                                    {article.urlToImage ? (
                                        <Image 
                                            source={{ uri: article.urlToImage }} 
                                            style={styles.articleImage}
                                        />
                                    ) : null}
                                    <Text style={styles.articleTitle}>{article.title}</Text>
                                    <Text style={styles.articleDescription}>
                                        {article.description}
                                    </Text>
                                    <Button 
                                        title="Read More"
                                        onPress={() => Linking.openURL(article.url)}
                                        color="#FF6347"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noArticlesText}>No popular news found</Text>
                    )
                )}
            </View>
        
            <View style={styles.newsSection}>
                <Text style={styles.sectionTitle}>Recommended News</Text>
                {isLoadingRecommended ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : (
                    recommendedArticles.length > 0 ? (
                        <ScrollView>
                            {recommendedArticles.map((article, index) => (
                                <View key={index} style={styles.article}>
                                    {article.urlToImage && (
                                        <Image
                                            source={{ uri: article.urlToImage }}
                                            style={styles.articleImage}
                                        />
                                    )}
                                    <Text style={styles.articleTitle}>{article.title}</Text>
                                    <Text style={styles.articleDescription}>{article.description}</Text>
                                    <Button 
                                        title="Read more"
                                        onPress={() => Linking.openURL(article.url)}
                                        color="#FF6347"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noArticlesText}>No recommended news found</Text>
                    )
                )}
            </View>
        </View>
        
        );    
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
        paddingBottom: 60, 
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    newsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    article: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    articleImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#444',
    },
    articleDescription: {
        fontSize: 14,
        color: '#777',
        marginBottom: 10,
    },
    noArticlesText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    loader: {
        marginTop: 20,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 16,
        color: '#333',
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
});
