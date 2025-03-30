import { useThemeConfig } from "@/context/useThemeConfig";
import { Center, Circle, CircleProps } from "@chakra-ui/react";

interface Props extends CircleProps {}
const MapMarkerCircle = ({ ...props }: Props) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Center
      bg={themeConfig.primaryColor}
      borderRadius={"full"}
      border={"2px solid"}
      borderColor={themeConfig.primaryColor}
    >
      <Circle
        bg={themeConfig.primaryColor}
        w={"20px"}
        h={"20px"}
        border={"3px solid"}
        borderColor={"body"}
        {...props}
      />
    </Center>
  );
};

export default MapMarkerCircle;
