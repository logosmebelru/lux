import { memo } from "react";
import SmartImage from "./SmartImage";

const ApartmentCard = memo(function ApartmentCard({ apartment, image }) {
  return (
    <article className="apartment-card">
      <div className="apartment-media">
        <SmartImage
          src={image}
          alt={apartment.title}
          className="apartment-image"
          fallbackLabel={apartment.code}
        />
      </div>
      <div className="apartment-content">
        <p className="apartment-code">{apartment.code}</p>
        <h3>{apartment.title}</h3>
        <p className="apartment-description">{apartment.description}</p>
        <dl className="apartment-specs">
          <div>
            <dt>Площадь</dt>
            <dd>{apartment.area}</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>{apartment.bedrooms}</dd>
          </div>
          <div>
            <dt>Этаж</dt>
            <dd>{apartment.floor}</dd>
          </div>
          <div>
            <dt>Стоимость</dt>
            <dd>{apartment.price}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
});

export default ApartmentCard;
