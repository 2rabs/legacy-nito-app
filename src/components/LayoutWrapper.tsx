import React from "react";
import { SectionContainer } from "@/components";

type Props = {
  children: React.ReactNode,
}

export const LayoutWrapper: React.FC<Props> = ({ children }: Props) => {
  return (
    <SectionContainer>
      <main className="mb-auto">{ children }</main>
    </SectionContainer>
  );
};
