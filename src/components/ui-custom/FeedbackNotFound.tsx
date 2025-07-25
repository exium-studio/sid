import { Icon, StackProps } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { EmptyState } from "../ui/empty-state";
import CContainer from "./CContainer";
import useLang from "@/context/useLang";

interface Props extends StackProps {
  title?: string;
  description?: string;
  children?: any;
}

export default function FeedbackNotFound({
  title,
  description,
  children,
  ...props
}: Props) {
  // Hooks
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      minH={"300px"}
      justify={"center"}
      {...props}
    >
      <EmptyState
        icon={
          <Icon mb={title ? -2 : 0}>
            <IconSearch />
          </Icon>
        }
        title={title || l.not_found_feedback.title}
        description={description || l.not_found_feedback.description}
        maxW={"300px"}
      >
        {children}
      </EmptyState>
    </CContainer>
  );
}
