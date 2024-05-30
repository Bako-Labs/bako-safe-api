import { generatePredicateVersionName } from '@src/utils/predicateVersionName';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewPredicateVersion1715016143734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO predicate_versions (
          name,
          description,
          code, 
          abi,
          bytes, 
          created_at,
          updated_at
        )
          VALUES (
            '${predicateVersion.name}',
            '${predicateVersion.description}',
            '${predicateVersion.code}',
            '${predicateVersion.abi}',
            '${predicateVersion.bytes}',
            CURRENT_TIMESTAMP + INTERVAL '${predicateVersion.timeout} seconds',
            CURRENT_TIMESTAMP + INTERVAL '${predicateVersion.timeout} seconds'
          )
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM predicate_versions
    WHERE code = '${predicateVersion.code}'
  `);
  }
}

export const predicateVersion = {
  timeout: 2,
  name: generatePredicateVersionName(
    '0xa8efb18f92443ae8f9d92953e5fb42e0bd3d183392b95f316b9f586874d89ebc',
  ),
  description:
    'Vault resolves security problem with duplicated signatures or witnesses in  0xcd8d8c3e7ac1498d4a8b02ffe31b4726239bfd802e0778d1d901766cfedf90ce version',
  code: '0xa8efb18f92443ae8f9d92953e5fb42e0bd3d183392b95f316b9f586874d89ebc',
  abi: JSON.stringify({
    types: [
      {
        typeId: 0,
        type: '[_; 10]',
        components: [
          {
            name: '__array_element',
            type: 1,
            typeArguments: null,
          },
        ],
        typeParameters: null,
      },
      {
        typeId: 1,
        type: 'b256',
        components: null,
        typeParameters: null,
      },
      {
        typeId: 2,
        type: 'bool',
        components: null,
        typeParameters: null,
      },
      {
        typeId: 3,
        type: 'u64',
        components: null,
        typeParameters: null,
      },
    ],
    functions: [
      {
        inputs: [],
        name: 'main',
        output: {
          name: '',
          type: 2,
          typeArguments: null,
        },
        attributes: null,
      },
    ],
    loggedTypes: [],
    messagesTypes: [],
    configurables: [
      {
        name: 'SIGNERS',
        configurableType: {
          name: '',
          type: 0,
          typeArguments: null,
        },
        offset: 5608,
      },
      {
        name: 'SIGNATURES_COUNT',
        configurableType: {
          name: '',
          type: 3,
          typeArguments: null,
        },
        offset: 5600,
      },
      {
        name: 'HASH_PREDICATE',
        configurableType: {
          name: '',
          type: 1,
          typeArguments: null,
        },
        offset: 5560,
      },
    ],
  }),
  bytes:
    '0x740000034700000000000000000015485dfcc00110fff3001aec5000910011381a4000005d47f00a264400001a5c70005047b98072480020284504805d43f00a285d14005d43f00b264000001a5470001a6000001a7800005d5bf00b5d43f00a16418400764003646140000113450000764400061341004076400001360000005043bba01a401000740000025043bba01a400000134500007644000613410040764000025d43f00c36400000617c010574000001617c00075d43f00d264000001a7070005043bcd85d47f0401045130072480020284114805047bd385d4bf04010492300724c0020284524c0a1410460134100001a6400001a6c00001a6800005d77f0127640033b164197c0764000065d43f0131541b400764000025d43f0131341b400244000005d43f04110410300614d94015047bdd872480020284504805043b79072440090284134405d43b0f2134100007640011c614194015047ba701ae900001ae5100020f8330058fbe00250fbe004740004221a47d00072481040104bb48072400040284914005083bdd8726010401063b6001a400000264000001a4070001345e0001a48000076440020134400007644001a10480780154520007644000174000008264800001a447000154c0000764c0001740000021a4c0000284504c01a4110001a50000016454780764400031a440000264400007400000c1a4400001045044010451500104d55005c4d30005e453000105140407500000b1a400000264000001a49e0001a4150005d47f041104513005d4ff041104d3300725010201053b500725c0020285115c0724410201047b44042450480724010901043b4007248002028411480724010901043b400724400201b4404401047b4407248002028453480724400201b4414401047b44072480020284534805047b420724800402847b480504bbfe0724c0040284914c05047bfe0504bb040724c0040284984c0504fb75072500020284d05003e4524c01a408000134100407640000a5043b6605fec00cc5047bfe050490008724c0040284914c0504bbc187244004828490440740000065043b3d85fec107b5fec0083504bbc1872440048284904405043bf3872440048284124405043b82072440048284124405d43b18313410040764000365043bf385047b8d872480048284504805d43b1e71341000076400001360000005043b8d8504100085047bec872480040284504805043bec8724400201b440440104504405043bec8724800201b481480104904805043b4a0724c0020284114c050450020724c0020284524c05047bb5072480040284504805043ba501ae910001ae5000020f8330058fbe00250fbe004740003551a43d0005047bdf872480020284504805043b5b85fec00b75047bdf8504bb0c0724c0020284914c050450008724c0020284524c0504bbc6072440028284904407400000a5043b820504100405047b3a05fec107450491020724c0008284904c0504bbc6072400028284914005d43f042104103005047b868724c0028284524c05d47b18c13451000504fbc8872480020284d048076440001740000095043b868504100085047bf8072480020284504805043bf80504fbc8872440020284d04407240002028813400505fbdd81a5000005d43f012164144001a44000076400001740000415043b2605d47f043104513007248014028411480724400201b454440104504405043bd187248002028417480504bbd98724c0020284914c0a14104a01a600000764000021051404075000016164186801a441000764000017400002a1641a600764000011341a6007640000c5d43f00a1b4106001041c4005047b6a85fec10d550491008724c0020284904c0504bbca87240002828491400740000055043b5505fec00aa504bbca872440028284904405043b95872440028284124405d43b1951341004076400001360000005043b958504100085047bf0872480020284504805043bf085047bdb87248002028457480a14104601a44000076400002106180407500002c5043bcd0740001e45043b79050410008724410b01047b44072480088284504805d43f03c105d34005d43b21e5047b9c01ae970001ae500001ae1100020f8330058fbe00250fbe004740002581a43d0005047bf2872480010284504805043bf285047b6d072480010284504805d4d10015047b6e072480010284504805d5110005d43b21e1b401400104174005d47b21f504bb9d01ae900001ae510001ae1200020f8330058fbe00250fbe0047400023f1a43d000724410801047b4407248001028450480724010801043b4005047b6f072480010284504805d6110015047b70072480010284504805d8110005d43b21e1b401400104174005d47b21f1b441440104104405d47b220504bb9e01ae900001ae510001ae1200020f8330058fbe00250fbe004740002211a43d0005047be1872480010284504805043be185047b71072480010284504805d8510015047b72072480010284504805d8910005043bab01ae9000020f8330058fbe00250fbe004740002cc1a43d0005d8d00005d5d00015d9100021341300076400021134240007640001a104244c0154505c07644000174000007264000001a447000154970007648000174000001284635c01a8d10001a5c0000164574c0764400051a440000264400001a9100001a5d00007400000c10463900104515c0104945c05c4920005e452000105d70407500000c1a400000264000001a9130001a5d30001a8d40001341e00076400021134240007640001a10424780154505c07644000174000007264000001a447000154970007648000174000001284635c01a8d10001a4c000016453780764400051a440000264400001a9100001a5d00007400000c10463900104514c0104954c05c4920005e452000104d30407500000c1a400000264000001a91e0001a5d60001a8d50001341800076400021134240007640001a10424600154505c07644000174000007264000001a447000154970007648000174000001284635c01a8d10001a4c000016453600764400051a440000264400001a9100001a5d00007400000c10463900104514c0104a04c05c4920005e452000104d30407500000c1a400000264000001a9180001a5d80001a8e00005043bae05fee315c5fed715d5fee415e5047b9f01ae900001ae5100020f8330058fbe00250fbe004740001b41a43d0005047be2872480020284504805043bac81ae9000020f8330058fbe00250fbe0047400024a1a43d0005d5100005d6100015d5d00021342100076400021134170007640001a10417840154506007644000174000007264000001a447000154980007648000174000001284546001a5110001a4c000016453840764400051a440000264400001a5d00001a6100007400000c104545c0104514c0104a24c05c4920005e452000104d30407500000c1a400000264000001a5e10001a6210001a5220005043be285d47f00a264400001a447000504bb9a0724c0020284904c05d43f00a284524005d43f00a1341000076400023134170007640001c5d43f00a10417400154906007648000174000007264000001a487000154d8000764c000174000001284946001a5120001a6000005d4bf00a16498480764800051a440000264400001a5d00001a6100007400000c104945c010492600104d16005c4d30005e493000106180407500000d1a400000264000005d5ff00a5d63f00a1a5110005d43f041104103005047baf85fed415f5fed81605fed7161504bba101ae910001ae5200020f8330058fbe00250fbe004740001471a47d000504bbe48724c0020284914c05063bdd8724410b01047b440504bbe48504fb080725000201b50050010513500725c0020285105c0725000201b50150010513500725c0020285105c05043b4607250004028413500504fbfa072500040284d05005043bfa0504fb0e072500040284d15005047b73072500020284525003f4134401a408000134100407640000a5043b5f05fec00be5047bfa050490008724c0040284914c0504bbba87244004828490440740000065043b4e05fec109c5fec00a4504bbba872440048284904405043b89072440048284124405d43b1751341000076400001360000005043b890504100085047be6872480040284504805043be68724400201b440440104504405043be68724800201b481480104904805043b578724c0020284114c050450020724c0020284524c05047bb1072480040284504805043ba301ae910001ae5000020f8330058fbe00250fbe004740001411a43d0007244002028610440505fbdd81a5000005d43f012164144001a44000076400001740000415043b1205d47f043104513007248014028411480724400201b454440104504405043bcf87248002028417480504bbd58724c0020284914c0a14104a01a600000764000021051404075000016164186801a441000764000017400002a1641a600764000011341a6007640000c5d43f00a1b4106001041c4005047b6385fec10c750491008724c0020284904c0504bbbf07240002828491400740000055043b5285fec00a5504bbbf072440028284904405043b93072440028284124405d43b17e1341004076400001360000005043b930504100085047bea872480020284504805043bea85047bd787248002028457480a14104601a44000076400002106180407500002c5043bcd01341104076400001740000225043bdd81345a74076440001740000141345d0001a481000764400025d47f03d1b49174015452740764400017400000b5d47f00a1b451480264400001a447000154dd000764c0001740000035d4ff00a1b4dd4c02845c4c01a7110001a7520005d47f00a1b4516801045c440504bb770724c0020284904c05d43f00a284524001069a040106db0401065904075000339240000005d43f00a16410600764000025d43f00a134106007640000a104176005047b5e05fec10bc5c4100005049100f5e490000504bbb907240001028491400740000055043b3c85fec0079504bbb9072440010284904405043b92072440010284124405d43b1721341004076400001360000005043b9205041000f5c4d00005d43f044104103005d47f03e1f453440724800011b451480104504405c4510001341e5807640000174000010134160001a481000764000025d43f03d1b490580154125807640000174000007264800001a407000155160007650000174000001284155801a5500001a592000104157805e4110001041e0405d47f044104513005c4bf1f811493480724c00011b4924c0104914805c452000134905807648000174000010134960001a4c1000764800025d4bf03d1b4d2580154935807648000174000007264c00001a487000155160007650000174000001284955801a5520001a593000104954005e4910001079004010618040750003c21af05000910000285ff100005ff110015ff120025ff130035ff3b0041aec5000910000101a43a0001a4790001a4b80001a4fe0001b4510405fed00005fed10011a43b00072440010284904401af52000920000101af9300059f050285d43c0005d47c0015d4bc0025d4fc0035defc004920000284af800001af05000910000505ff100005ff110015ff120025ff130035ff140045ff150055ff160065ff170075ff180085ff3b0091aec5000910000201a43a0001a4790001a4be0001a4c0000264c00001a4c70005d5100005d5500025d410002134100001a58000076400020134000007640001a10580540154160007640000174000008265800001a407000155c0000765c0001740000021a5c0000284135c01a4d00001a60000016418540764000031a400000264000007400000c1a4000001041340010410600105d46005c5d70005e417000106180407500000b1a400000264000001a5950001a4d40005d43f041104103007250002028ed05001a43b00042413580724c0020284504c01af51000920000201af9200059f050505d43c0005d47c0015d4bc0025d4fc0035d53c0045d57c0055d5bc0065d5fc0075d63c0085defc009920000504af800001af05000910000385ff100005ff110015ff120025ff130035ff140045ff150055ff3b0061aec5000910000781a43a0001a4790001a4be0005d4ff041104d33001a500000265000001a5070005fed40085fec00095fec000a5053b0407254004028ed05401aebb0001ae5400020f8330058fbe00250fbe004740000495043b05872500020284135005043b0585d4fb0085d53b00a42413500724c0020284504c01af51000920000781af9200059f050385d43c0005d47c0015d4bc0025d4fc0035d53c0045d57c0055defc006920000384af800001af05000910000285ff100005ff110015ff120025ff130035ff3b0041aec5000910000001a43a0001a4790001a4be000724c0040284504c01af51000920000001af9200059f050285d43c0005d47c0015d4bc0025d4fc0035defc004920000284af800001af05000910000205ff100005ff110015ff120025ff3b0031aec5000910000001a43a0001a47e0001a480000264800001a4870005f4120005f4000015f4000021af50000920000001af9100059f050205d43c0005d47c0015d4bc0025defc003920000204af800001af05000910000585ff100005ff110015ff120025ff130035ff140045ff150055ff160065ff170075ff180085ff190095ff3b00a1aec5000910000401a43a0001a6790001a63e0005d47f00a264400001a4470007248002028ed04801a4bb0005d4d20005d5120015d5520025d4920035f4530005f4540015f4550025f4520035d4bf00a134920007648002c5d49900213492000764800225d4990025d4ff00a104924c05d4d90025d5190005d559001155925407658000174000007264800001a587000155d5000765c000174000001285945401a5160005f6540001a5800005d53f00a16516500765000055f6520015f6520021a440000264400007400000f5d519000105144c010514580105515805c5550005e515000105960407500000e5f6510005d47f00a5f6510015d47f00a5f6510021a44000026440000504100205d47f00a264400001a447000504bb020724c0020284904c05d4120005d4d20015d5120025d4920035f4500005f4530015f4540025f4520035d43f00a134100007640002c5d41900213410000764000225d4190025d4bf00a104104805d4990025d4d90005d519001155505007654000174000007264000001a547000155940007658000174000001285535001a4d50005f6530001a5400005d4ff00a164d54c0764c00055f6500015f6500021a400000264000007400000f5d4d9000104d3480104d3540105115405c5140005e4d4000105550407500000e5f6510005d43f00a5f6500015d43f00a5f6500021a400000264000001af40000920000401af9800059f050585d43c0005d47c0015d4bc0025d4fc0035d53c0045d57c0055d5bc0065d5fc0075d63c0085d67c0095defc00a920000584af8000047000000000000000000000000000000000000000000000000000000000000000000000030313233343536373839616263646566111111111111111111111111111111111111111111111111111111111111111100000000000000200000000000000040cccccccccccc000200000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000200000000000000040f0000000000000000000000000015b80000000000001548000000000000157800000000000015e80000000000001568',
};
