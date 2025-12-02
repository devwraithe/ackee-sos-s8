/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/euergetes.json`.
 */
export type Euergetes = {
  address: "EjYxegxKpBLxr1cZfbVzkGKWdD31F4w23kd5x2AMeB11";
  metadata: {
    name: "euergetes";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "sendTip";
      discriminator: [231, 88, 56, 242, 241, 6, 31, 59];
      accounts: [
        {
          name: "tipper";
          writable: true;
          signer: true;
        },
        {
          name: "receiver";
          writable: true;
        },
        {
          name: "tipperStats";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  105,
                  112,
                  112,
                  101,
                  114,
                  45,
                  115,
                  116,
                  97,
                  116,
                  115
                ];
              },
              {
                kind: "account";
                path: "tipper";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "tipperStats";
      discriminator: [122, 219, 214, 77, 138, 151, 107, 134];
    }
  ];
  events: [
    {
      name: "tipSentEvent";
      discriminator: [157, 51, 73, 82, 54, 34, 208, 198];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "noSelfTip";
      msg: "Cannot send tip to yourself";
    },
    {
      code: 6001;
      name: "invalidAmount";
      msg: "Tip amount must be greater than zero";
    },
    {
      code: 6002;
      name: "belowMinimumTip";
      msg: "Tip amount is below the allowed minimum";
    },
    {
      code: 6003;
      name: "exceedsMaximumTip";
      msg: "Tip amount exceeds the allowed maximum";
    },
    {
      code: 6004;
      name: "insufficientFunds";
      msg: "Insufficient funds to process this tip";
    }
  ];
  types: [
    {
      name: "tipSentEvent";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tipper";
            type: "pubkey";
          },
          {
            name: "receiver";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "timestamp";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "tipperStats";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tipper";
            type: "pubkey";
          },
          {
            name: "totalTips";
            type: "u64";
          },
          {
            name: "totalAmount";
            type: "u64";
          },
          {
            name: "biggestTip";
            type: "u64";
          },
          {
            name: "lastTip";
            type: "i64";
          }
        ];
      };
    }
  ];
};
