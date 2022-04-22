import { defineStore } from 'pinia'
export const useShopStore = defineStore('shop', {
  state: () => {
    return {
      shopCartList: [
        {
          author: '丹尼尔·笛福',
          categoryId: 1,
          commodityNum: '4',
          delFlag: 0,
          id: 1,
          imgUrl: 'https://source.aring.cc/upload/1650338181462-c83d70cf3bc79f3d5245df72b3a1cd11738b29cf.jpg',
          name: '鲁宾逊漂流记',
          press: '中国友谊出版社',
          price: 25.33,
          publicationTime: '1993-03-25T16:00:00.000Z',
          words: 1200000,
          num: 1
        },
        {
          author: '施耐庵',
          categoryId: 1,
          commodityNum: null,
          delFlag: 0,
          id: 3,
          imgUrl: 'https://source.aring.cc/upload/1650509033001-0eb30f2442a7d9338293476ba44bd11373f001ea.jpg',
          name: '水浒传',
          press: '人民文学出版社',
          price: 45.5,
          publicationTime: '2006-04-05T16:00:00.000Z',
          words: 900000,
          num: 3
        }
      ]
    }
  }
})
