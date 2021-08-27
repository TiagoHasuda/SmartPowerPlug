import React from "react"
import { ActivityIndicator, NativeSyntheticEvent, NativeTouchEvent } from "react-native"

import {
    Container,
    Text,
} from "./index-styles"

interface ButtonProps {
    title: string
    onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void
    loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, loading }) => {
    return <Container onPress={(ev) => !loading && onPress(ev)}>
        {loading ? <ActivityIndicator color="#CCC" /> : <Text>{title}</Text>}
    </Container>
}
