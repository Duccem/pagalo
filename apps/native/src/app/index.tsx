import { Redirect } from "expo-router";
const Index = () => {
  console.log("Redirecting to /tabs");
  return <Redirect href={"/(tabs)"} />;
};

export default Index;

