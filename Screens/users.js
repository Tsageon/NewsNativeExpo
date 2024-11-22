import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoading: false,
            error: null,
        };
    }


    fetchUsers = async () => {
        this.setState({ isLoading: true });
        try {
            const response = await fetch('https://674036e1d0b59228b7ef1689.mockapi.io/users');
            const users = await response.json();
            this.setState({ users, isLoading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching users', isLoading: false });
        }
    };

    addUser = async () => {
        const newUser = {
            createdAt: new Date().toISOString(),
            name: 'New User',
            avatar: 'https://via.placeholder.com/150',
            Preferences: 'New Preferences',
        };
        try {
            const response = await fetch('https://674036e1d0b59228b7ef1689.mockapi.io/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const addedUser = await response.json();
            this.setState((prevState) => ({
                users: [...prevState.users, addedUser],
            }));
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    updateUser = async (id) => {
        const updatedData = {
            name: 'Updated User',
            Preferences: 'Updated Preferences',
        };
        try {
            const response = await fetch(`https://674036e1d0b59228b7ef1689.mockapi.io/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            const updatedUser = await response.json();
            this.setState((prevState) => ({
                users: prevState.users.map((user) =>
                    user.id === id ? { ...user, ...updatedUser } : user
                ),
            }));
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    deleteUser = async (id) => {
        try {
            await fetch(`https://674036e1d0b59228b7ef1689.mockapi.io/users/${id}`, { method: 'DELETE' });
            this.setState((prevState) => ({
                users: prevState.users.filter((user) => user.id !== id),
            }));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    componentDidMount() {
        this.fetchUsers();
    }

    render() {
        const { users, isLoading, error } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.header}>User Management</Text>
                {error && <Text style={styles.error}>{error}</Text>}

                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <ScrollView>
                        <TouchableOpacity style={styles.addButton} onPress={this.addUser}>
                            <Text style={styles.addButtonText}>Add User</Text>
                        </TouchableOpacity>
                        {users.map((user) => (
                            <View key={user.id} style={styles.userCard}>
                                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userPreferences}>{user.Preferences}</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => this.updateUser(user.id)}
                                    >
                                        <Text style={styles.actionText}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.deleteButton]}
                                        onPress={() => this.deleteUser(user.id)}
                                    >
                                        <Text style={styles.actionText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userPreferences: {
        fontSize: 14,
        color: '#777',
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        marginLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UserManagement;