// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;

interface IPancakeV3LmPoolDeveloper {
    function parameters() external view returns (address pool, address masterChef);
}
