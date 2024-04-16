import listToTree from "@src/utils/list-to-tree"
import * as Icons from "@ant-design/icons"
import React from "react"

const { AppstoreOutlined, FilterOutlined, GlobalOutlined, UserOutlined } = Icons

const categories = (list: any, icon: React.ReactNode) => {
    const categories = listToTree(list)
    let newCategories = [{
        label: "Категории",
        icon: icon,
        children: [
            {
              label: "Все" ,
            }, 
            transformObject(categories[0]),
            transformObject(categories[1])
        ]
    }]
    function transformObject(obj: any) {
        const result = {} as any
        for (const key in obj) {
          if (key === '_id') {
            result['key'] = obj[key]
          } else if (key === 'title') {
            result['label'] = obj[key]
          } else if (key === 'children') {
            result['children'] = obj[key].map((child: any) => transformObject(child))
          }
        }
        return result
      }

      return newCategories
  }

  export default categories