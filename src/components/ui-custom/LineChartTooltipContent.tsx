import { Text } from "@chakra-ui/react";
import CContainer from "./CContainer";

const LineChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <CContainer
        bg={"darktrans"}
        backdropFilter={"blur(5px)"}
        px={3}
        py={2}
        gap={1}
        borderRadius={6}
      >
        <Text fontWeight={"bold"} color={"fg.subtle"}>{`${label}`}</Text>

        {payload.map((item: any, index: number) => (
          <Text
            key={index}
            color={"white"}
            // color={item.color}
          >
            {`${item.name}: ${item.value.toLocaleString()}`}
          </Text>
        ))}
      </CContainer>
    );
  }

  return null;
};

export default LineChartTooltipContent;
