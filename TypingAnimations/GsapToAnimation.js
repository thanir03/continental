import { StyleSheet, Text, View, Animated } from 'react-native';
import * as React from 'react';

export default class GSAPToTextAnimator extends React.Component {
    animatedValue = new Animated.Value(0);

    componentDidMount() {
        this.animate();
    }

    animate(toValue = 1) {
        Animated.timing(this.animatedValue, {
            toValue,
            duration: 500,
            useNativeDriver: true, // Better performance
        }).start();
    }

    render() {
        return (
            <View style={this.props.style}>
                <Animated.Text
                    style={[
                        this.props.textStyle,
                        {
                            opacity: this.animatedValue,
                            transform: [{
                                translateY: this.animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [10, 0], // Move up by 10 units
                                })
                            }]
                        },
                    ]}
                >
                    {this.props.content}
                </Animated.Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({});
