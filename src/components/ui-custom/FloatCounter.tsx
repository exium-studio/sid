import { Circle, CircleProps, Float, FloatProps } from "@chakra-ui/react";

interface Props extends FloatProps {
  children?: any;
  circleProps?: CircleProps;
}

const FloatCounter = ({ children, circleProps, ...props }: Props) => {
  return (
    <Float {...props}>
      <Circle
        px={"5px"}
        // bg={themeConfig.primaryColor}
        bg={"ibody"}
        color={`body`}
        fontSize={"xs"}
        h={"18px"}
        mt={"8px"}
        mr={"8px"}
        {...circleProps}
      >
        {children}
      </Circle>
    </Float>
  );
};

export default FloatCounter;
