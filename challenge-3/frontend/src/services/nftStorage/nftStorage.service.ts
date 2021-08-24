import { DEFAULT_IPFS_GATEWAY } from '../../shared/constants/config.constants';
import IPFS from 'ipfs-http-client';

class NftStorageService {
  private static _client = IPFS.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: 'http'
  })

  public static async storeNft(name: string, description: string, image: File) {
    const imgIpfsResult = await this._client.add(image);

    const imageCid = this.formatIpfsCid(imgIpfsResult.cid);
    const finalObject = {
      name,
      description,
      image: imageCid
    }

    const finalIpfsResult = await this._client.add(JSON.stringify(finalObject));

    return {
      metadata: this.formatIpfsCid(finalIpfsResult.cid),
      img: imageCid
    };
  }

  public static formatIpfsCid(cid: IPFS.CID) {
    return `ipfs://${cid.toString()}`
  }

  public static parseNftLink(url: string, gatewayUrl = DEFAULT_IPFS_GATEWAY) {
    const result = RegExp("(?<=ipfs://).*$").exec(url);

    return gatewayUrl + result;
  }
}

export default NftStorageService;
