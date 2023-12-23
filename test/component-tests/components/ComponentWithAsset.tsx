import React from "react"
import SvgAsset from "./asset.svg"


export function ComponentWithAsset() {
    return <div>
        <img src={SvgAsset} />
    </div>
}