import { StyleSheet, Text, View, Animated } from 'react-native';
import * as React from 'react';

export default class TextAnimator extends React.Component {
    animatedValues = [];

    constructor(props) {
        super(props);

        const textArr = props.content.trim().split(' ');
        textArr.forEach((_, i) => {
            this.animatedValues[i] = new Animated.Value(0);
        });
        this.textArr = textArr;
    }

    componentDidMount() {
        this.animate();
    }

    animate(toValue = 1) {
        const animations = this.textArr.map((_, i) => {
            return Animated.timing(this.animatedValues[i], {
                toValue,
                duration: 300,
                useNativeDriver: true, // Add useNativeDriver for better performance
            });
        });
        Animated.stagger(80, animations).start();
    }

    render() {
        return (
            <View style={[this.props.style, styles.textWrapper]}>
                {this.textArr.map((word, index) => {
                    return (
                        <Animated.Text
                            key={`${word}-${index}`}
                            style={[
                                this.props.textStyle,
                                { opacity: this.animatedValues[index],
                                  transform: [{
                                    translateY: Animated.multiply(
                                        this.animatedValues[index],
                                        new Animated.Value(-10)
                                    )
                                  }]
                                 }, 
                            ]}
                        >
                            {word}
                            {index < this.textArr.length - 1 ? ' ' : ''}
                        </Animated.Text>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'left',
    },
});