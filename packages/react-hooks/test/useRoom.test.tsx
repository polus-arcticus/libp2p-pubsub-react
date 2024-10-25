import * as React from "react";
import  { useState } from "react";
import { describe, it, expect } from "vitest";
import {render, fireEvent, screen, renderHook} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { useRoom } from "../src/useRoom";
import { Libp2pContext, Libp2pProvider } from "../src/providers/Libp2pProvider";

const wrapper = ({ children  }) => (
  <Libp2pProvider>
    {children}
  </Libp2pProvider>

);

describe("useRoom", () => {
  it("should", () => {
    //const room = renderHook(() => useRoom());
    const room = renderHook(() => useRoom(), { wrapper });
    expect(room).toBeTruthy();
  });
});
