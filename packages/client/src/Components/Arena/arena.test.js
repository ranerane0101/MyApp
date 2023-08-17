import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Arena from './arena';

describe('Arena', () => {
  // localStorage をモックする
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  it('fetches and sets bosses data on component load', async () => {
    const mockBoss1 = {
      name: 'Boss 1',
      // 他のプロパティも追加
    };
    const mockBoss2 = {
      name: 'Boss 2',
      // 他のプロパティも追加
    };

    // モックしたgameContract.getBeverage関数を定義します
    const mockGetBeverage = jest.fn();
    mockGetBeverage
      .mockResolvedValueOnce(mockBoss1)
      .mockResolvedValueOnce(mockBoss2);

    // テスト対象のコンポーネントをレンダリングします
    render(<Arena />);

    // ボスのデータが正しく取得され、setBossesが呼ばれるのを待機します
    await waitFor(() => {
      expect(mockGetBeverage).toHaveBeenCalledTimes(2);
    });

    // ボスのデータが適切にセットされたか検証します
    // 以下に必要なアサーションを記述します
    // モックのデータと実際のデータが一致するか確認するなど
  });
});
