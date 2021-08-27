import AsyncStorage from "@react-native-async-storage/async-storage"

export const MakeUrl = async (path: string) => {
    const storage = await AsyncStorage.getItem("switch")
    if (storage === "false" || !storage)
        return "http://192.168.15.83:90/".concat(path)
    else
        return "http://jameswebserver.ddns.net:4343/".concat(path)
}
