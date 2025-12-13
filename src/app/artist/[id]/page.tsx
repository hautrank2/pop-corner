import Image from "next/image";
import { notFound } from "next/navigation";

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Typography } from "~/components/ui/typography";
import { ArtistModel } from "~/types/artist";
import { getAssetUrl } from "~/utils/asset";
import { PageError } from "~/components/pages";
import { httpServer } from "~/app/libs/server-http";
import { formatDateTime } from "~/utils/datetime";
import { COUNTRY_DATA } from "~/constants/country";

type ArtistPageProps = {
  params: Promise<{ id: string }>;
};

const ArtistPage = async ({ params }: ArtistPageProps) => {
  try {
    const { id } = await params;
    const artistRes = await (
      await httpServer()
    ).get<ArtistModel>(`/api/artist/${id}`);

    const artist = artistRes.data;
    const contry = COUNTRY_DATA.find((e) => e.name.common === artist.country);
    if (!artist) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[240px_1fr]">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <Image
                src={getAssetUrl(artist.avatarUrl)}
                alt={artist.name}
                width={220}
                height={300}
                className="rounded-xl object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <Typography variant="h1">{artist.name}</Typography>
                <div className="mt-2 flex flex-wrap gap-4">
                  <div className="flex justify-start gap-2">
                    {contry && (
                      <Image
                        src={contry?.flags.svg}
                        alt={artist.country}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}{" "}
                    <Typography variant={"p"}>{artist.country}</Typography>
                  </div>
                  <Badge variant="outline">
                    Birthday: {formatDateTime(artist.birthday, "MMM DD YYYY")}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Typography variant="h3">Biography</Typography>
                <Typography className="text-muted-foreground leading-relaxed">
                  {artist.bio}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (err) {
    console.log(err);
  }

  return <PageError />;
};

export default ArtistPage;
